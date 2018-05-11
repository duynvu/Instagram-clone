INSERT INTO users(username, password) VALUES
("anh","123"),
("binh","123"),
("cong","123"),
("dung","123"),
("long","123"),
("loc", "123"),
("trung", "123"),
("hoang", "123"),
("lan", "123");

INSERT INTO photos(image_url, user_id, caption) VALUES
("https://www.w3schools.com/w3images/lights.jpg", 3, "Just caption"),
("http://www.hcxypz.com/data/out/149/648637.jpeg", 1, "Whoo hoo"),
("https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&h=350", 4, "Hello"),
("https://media.cntraveler.com/photos/5644ff4e96771ce632e40377/4:3/w_420,c_limit/lake-tahoe-nevada-cr-gallery-stock.jpg", 8, "First photo"),
("https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&h=350", 3, "New"),
("https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&h=350", 5, "Hey!"),
("https://i.pinimg.com/originals/f4/a8/ac/f4a8ac1a2d768fdfbc73dd35f93a9292.jpg", 6, "Haha"),
("https://i.pinimg.com/originals/95/9e/53/959e53618eed4cb54bc51eb03a71698b.jpg", 6, "Something"),
("http://bdfjade.com/data/out/154/6562287-wallpaper-beautiful.jpg", 6, "");

INSERT INTO photos(id, image_url, user_id) VALUES
(2,"http://lorempixel.com/640/480/", 1),
(10,"http://lorempixel.com/640/480/", 3);

INSERT INTO comments(comment_text, photo_id, user_id) VALUES
("hello", 1, 1),
("bello", 1, 4),
("hi", 1, 3),
("nah", 2, 3),
("no", 2,8);

INSERT INTO likes(user_id, photo_id) VALUES
(2,4),
(2,3),
(2,10),
(4,5),
(4,6),
(5,5),
(5,7),
(5,13),
(6,13),
(5,8),
(7,4),
(8,1),
(8,2),
(9,10),
(13,10),
(13,11);

INSERT INTO follows(follower_id,followee_id) VALUES
(1,2),
(1,4),
(1,5),
(1,7),
(1,13),
(2,13),
(4,6),
(5,3),
(5,8),
(6,5),
(8,5),
(13,4);



SELECT username, image_url
FROM users
JOIN photos
ON users.id = photos.user_id;