
INSERT INTO Emotion (emotion) values ('기쁨');
INSERT INTO Emotion (emotion) values ('슬픔');
INSERT INTO Emotion (emotion) values ('어두움');
INSERT INTO Emotion (emotion) values ('잔잔');
INSERT INTO Emotion (emotion) values ('어두움');

INSERT INTO Music (title, url) values  ('test1.mp4', '/Users/seokbeomlee/Desktop/Project/floread/music/test1.mp4');
INSERT INTO Music (title, url) values  ('test2.mp4', '/Users/seokbeomlee/Desktop/Project/floread/music/test2.mp4');
INSERT INTO Music (title, url) values  ('test3.mp4', '/Users/seokbeomlee/Desktop/Project/floread/music/test3.mp4');

INSERT INTO MusicEmotion (emotion_id, music_id) values (1, 1);
INSERT INTO MusicEmotion (emotion_id, music_id) values (1, 2);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 1);
INSERT INTO MusicEmotion (emotion_id, music_id) values (3, 3);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 3);