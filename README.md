# pet-social

## Summary

Pet Social is a simple social media for posting pictures of your pets. You can create your own posts, up/down vote posts, favorite posts and comment on posts.

Link to trello board: https://trello.com/b/Mv5plmrQ/pet-social

## Page Summary

### /petsocial/home

This is the home page, here you will get an infitine scroll of posts (until you run out of posts). You can up/down vote, favorite or comment on posts here. You can also go to the poster's profile from their post.

![alt text](https://snipboard.io/NZp2g8.jpg)


### /petsocial/profile/{username}

This is the profile page, it will show all of the user's posts, this also has infinte scroll. You can all the same functions as the home page, although you will have to click on the post to expand it into a modal to comment on it. 

![alt text](https://snipboard.io/0f8eA7.jpg)

### /petsocial/sign?type=(in,up)

This is the signup/signin page. You will need a email and username to sign up with. 

![alt text](https://snipboard.io/zXxDQh.jpg)

![alt text](https://snipboard.io/3rO9hV.jpg)


### Create post modal

Using the nav you can click "Create Post" to bring up a modal to create a post. You will need to be signed in to see the "Create Post" button. To create a post you can either upload a picture or get a random dog image (uses the dog API https://dog.ceo/dog-api/). Once a post is created it will redirect you to your profile page.

![alt text](https://snipboard.io/4zO0RH.jpg)


## Backend Summary

### /auth/signin

Post to signin, with body (email, password).
Returns a token and account username.

### /auth/signup

Post to signup, with body (email, username, password)
Returns same as a successful sign in, will fail if password is too short or if email/username is already in use.

### /public/home?pageNumber=()&lastPost=() //lastpost is currently unused

Gets a list of posts, sorted by posted date, and page size is 5

### /public/home?username=()&pageNumber=()&lastPost=() //lastpost is currently unused

Gets a list of posts filtered by username, sorted by posted date, and page size is 10

### /api/createpost

Post request with body (Base64 image, description). Will return the post itself if successful

### /api/deletepost/{postId}

Delete request, successful if the token is valid for the post's user

### /api/post/{postId}/vote

Post request with body (value), value is either 1 (upvote), -1(downvote), or 0 (no vote/removal of vote). Returns the entire post. 

### /api/post/{postId}/comment

Post request with body (comment), returns the entire post. 

### /api/post/{postId}/favorite

Post request with body (isFavorite), returns the entire post.





