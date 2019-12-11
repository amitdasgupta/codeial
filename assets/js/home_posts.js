import "./toggle_likes";
{
  let loadPage = function() {
    let postLinks = $("a.delete-post-button");
    postLinks.each(function() {
      deletePost($(this));
    });
    //make changes here so that likes link doesn't delete comment and also make similar funtion for like dynamically
    let commentsLinks = $("a.delete-comment-button");
    $(commentsLinks).each(function() {
      console.log();
      deleteComment($(this));
    });
  };
  // method to submit new data using ajax
  let createPost = function() {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function(e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function(data) {
          new Noty({
            type: "success",
            layout: "topRight",
            text: "Post added!",
            timeout: 1000
          }).show();
          console.log(data);
          $(":input", newPostForm)
            .not(":submit")
            .val("");
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          // delete first element inside of other element
          deletePost($(".delete-post-button", newPost));
          createComment($(`#post-${data.data.post._id} form`));
        },
        error: function(err) {
          console.log(err.responseText);
        }
      });
    });
  };
  // method to create a post in dom

  let newPostDom = function(post) {
    const dom = $(`<li id="post-${post._id}">
        <p>
          <small>
              <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
          </small>
          ${post.content}
          <br>
          <small>
              ${post.user.name}
          </small>
          <br>
  
        <small>
            <a href="/likes/toggle/?id=${post._id}&type=Post"  class=toggle-likes>
            ${post.likes.length} Like
            </a>
        </small>

        </p>
        <div class="post-comments">
        <form action="/comments/create" method="post" class="new-comment-form">
            <input type="text" name="content" placeholder="Type here to add comment...">
            <input type="hidden" name="post" value="${post._id}">
            <input type="submit" value="Add Comment">
        </form>
        <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
           
            </ul>
        </div>
        </div>
        </li>
     `);
    const deleteDom = $(dom).find(".toggle-likes");
    new ToggleLike(deleteDom);
    return dom;
  };

  // method to delete a post from dom
  let deletePost = function(deleteLink) {
    $(deleteLink).click(function(e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function(data) {
          new Noty({
            type: "info",
            layout: "topRight",
            text: "Post removed!",
            timeout: 1000
          }).show();
          console.log(data);
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function(err) {
          console.log(err.responseText);
        }
      });
    });
  };

  // comments section*******************************************
  let createComment = function(commentForm) {
    commentForm.submit(function(e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: commentForm.serialize(),
        success: function(response) {
          new Noty({
            type: "success",
            layout: "topRight",
            text: "Comment created!",
            timeout: 1000
          }).show();

          console.log(response);
          let comment = $(`
                <li>
                <p>
                        <small>
                            <a href="/comments/destroy/${response.data._id}" class="delete-comment-button">X</a>
                        </small>
                        ${response.data.content}
                        <br>
                        <small>
                        ${response.data.user.name}
                        </small>
                        <small>
                            <a href="/likes/toggle/?id=${response.data._id}&type=Comment" class=toggle-like>
                            ${response.data.likes.length} Like
                            </a>
                        </small>
                </p>
                </li>
                    `);
          $(".post-comments-list>ul", `#post-${response.data.post}`).prepend(
            comment
          );
          $(":input", commentForm)
            .not(":submit,:hidden")
            .val("");
          deleteComment($("a", comment));
          const deleteDom = $(this).find(".toggle-likes");
          new ToggleLike(deleteDom);
        }
      });
    });
  };

  let createPostComment = function() {
    let commentForms = $(".new-comment-form");
    $(commentForms).each(function() {
      createComment($(this));
    });
  };

  let deleteComment = function(deleteLink) {
    $(deleteLink).click(function(e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function(response) {
          new Noty({
            type: "info",
            layout: "topRight",
            text: "Comment removed!",
            timeout: 1000
          }).show();
          console.log(response);
          $(deleteLink)
            .closest("li")
            .remove();
        }
      });
    });
  };
  loadPage();
  createPost();
  createPostComment();
}
