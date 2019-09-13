{
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
                let newPost=newPostDom(data.data.post);
                $("#posts-list-container>ul").prepend(newPost);
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
        </li>
        <div class="post-comments">
        <form action="/comments/create" method="post">
            <input type="text" name="content" placeholder="Type here to add comment...">
            <input type="hidden" name="post" value="${post._id}">
            <input type="submit" value="Add Comment">
        </form>
        </div>
     `);
    }
    createPost();
}