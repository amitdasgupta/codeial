{
    let loadPage=function(){
        let postLinks=$('a.delete-post-button');
        postLinks.each(function(){
           deletePost($(this)); 
        });
        let commentsLinks=$('.post-comments-list a');
        $(commentsLinks).each(function(){
           deleteComment($(this));
        });
    }
    // method to submit new data using ajax
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/posts/create",
            data: newPostForm.serialize(),
            success: function (data) {
                console.log(data);
                $(':input',newPostForm).not(':submit').val('');
                let newPost=newPostDom(data.data.post);
                $("#posts-list-container>ul").prepend(newPost);
                // delete first element inside of other element
                deletePost($('.delete-post-button',newPost));
                createComment($(`#post-${data.data.post._id} form`));
            },
            error:function(err){
                console.log(err.responseText);
            }
        });
        });
    }
    // method to create a post in dom

    let newPostDom=function(post){
        return $(`<li id="post-${post._id}">
        <p>
          <small>
              <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
          </small>
          ${post.content}
          <br>
          <small>
              ${post.user.name}
          </small>
        </p>
        <div class="post-comments">
        <form action="/comments/create" method="post" class="new-comment-form">
            <input type="text" name="content" placeholder="Type here to add comment...">
            <input type="hidden" name="post" value="${post._id}">
            <input type="submit" value="Add Comment">
        </form>
        </div>
        </li>
     `);
    }

    // method to delete a post from dom
    let deletePost=function(deleteLink){
        $(deleteLink).click(function (e) { 
            e.preventDefault();
            $.ajax({
                type: "get",
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                },
                error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

    // comments section*******************************************
    let createComment=function(commentForm){
        console.log(commentForm);
    commentForm.submit(function (e) { 
        e.preventDefault();
        $.ajax({
            type: "post",
            url: '/comments/create',
            data: commentForm.serialize(),
            success: function (response) {
                console.log(response);
                let comment=$(`
                <li>
                <p>
                        <small>
                            <a href="/comments/destroy/${response.data._id}">X</a>
                        </small>
                        ${response.data.content}
                        <br>
                        <small>
                        ${response.data.user.email}
                        </small>
                </p>
                </li>
                    `);
                $('.post-comments-list>ul',`#post-${response.data.post}`).prepend(comment);
                $(':input',commentForm).not(':submit,:hidden').val('');
                deleteComment($('a',comment));
            }
        });
    });
    }

    let createPostComment=function(){
        let commentForms=$('.new-comment-form');
        $(commentForms).each(function(){
            createComment($(this));
        });
     }
    
    let deleteComment=function(deleteLink){
        $(deleteLink).click(function (e) { 
            e.preventDefault();
            $.ajax({
                type: "get",
                url: $(deleteLink).prop('href'),
                success: function (response) {
                    console.log(response);
                    $(deleteLink).closest('li').remove();
                }
            });
        });
    }
    loadPage();
    createPost();
    createPostComment();
}