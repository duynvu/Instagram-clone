-- photo/index.ejs

-- Get the image-url, date, content of the photos and username of the photos
SELECT image_url,
        photos.created_at, 
        IFNULL(caption,"") as caption, 
        username
FROM photos
    INNER JOIN users
    ON photos.user_id = users.id
WHERE photos.id = 2;

-- SELECT image_url, photos.created_at, IFNULL(caption,"") as caption, username FROM photos INNER JOIN users ON photos.user_id = users.id WHERE photos.id = 2;
-- GET username, created_at, content of all the comments on that photos
SELECT comments.id, users.username, comments.created_at, comments.comment_text
FROM comments
    INNER JOIN users
        ON comments.user_id = users.id
WHERE comments.photo_id = (SELECT photos.id FROM photos WHERE photos.id = 2);

-- SELECT comments.id, users.username, comments.created_at, comments.comment_text FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.photo_id = (SELECT photos.id FROM photos WHERE photos.id = ?);

-- users/index.ejs
-- Get number of people that user follow

SELECT COUNT(*) as nofollower FROM follows WHERE follower_id = (SELECT id FROM users WHERE username="anh");

-- Get number of people following that user
SELECT COUNT(*) FROM nofollowee WHERE followee_id= (SELECT id FROM users WHERE username= ?);

-- Check if currentUser has followed user in index.ejs
SELECT * FROM follows WHERE follower_id=1 AND followee_id = 4;

--Show pictures in index page
SELECT photos.id, image_url, caption, photos.created_at, username as username
FROM photos
    JOIN follows
        ON photos.user_id = follows.follower_id
    JOIN users
        ON follows.followee_id = users.id
WHERE photos.user_id = 13
ORDER BY created_at DESC;

SELECT photos.id, image_url, caption, username as username FROM photos JOIN follows ON photos.user_id = follows.followee_id JOIN users ON follows.followee_id = users.id WHERE follows.follower_id = ? ORDER BY photos.created_at DESC;


-- Check people who the current users follows
SELECT username
FROM follows
    JOIN users
        ON users.id = follows.followee_id
WHERE follows.follower_id = 13;

