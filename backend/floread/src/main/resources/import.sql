
INSERT INTO Emotion (emotion) values ('행복');
INSERT INTO Emotion (emotion) values ('불안');
INSERT INTO Emotion (emotion) values ('놀람');
INSERT INTO Emotion (emotion) values ('슬픔');
INSERT INTO Emotion (emotion) values ('분노');
INSERT INTO Emotion (emotion) values ('중립');

INSERT INTO Music (title, url) values  ('angry.mp3', 'http://localhost:8080/angry.mp3');
INSERT INTO Music (title, url) values  ('happy1.mp3', 'http://localhost:8080/music/happy1.mp3');
INSERT INTO Music (title, url) values  ('happy2.mp3', 'http://localhost:8080/music/happy2.mp3');
INSERT INTO Music (title, url) values  ('sad1.mp3', 'http://localhost:8080/music/sad1.mp3');
INSERT INTO Music (title, url) values  ('sad2.mp3', 'http://localhost:8080/music/sad2.mp3');
INSERT INTO Music (title, url) values  ('sad3.mp3', 'http://localhost:8080/music/sad3.mp3');
INSERT INTO Music (title, url) values  ('scary1.mp3', 'http://localhost:8080/music/scary1.mp3');
INSERT INTO Music (title, url) values  ('scary2.mp3', 'http://localhost:8080/music/scary2.mp3');
INSERT INTO Music (title, url) values  ('scary3.mp3', 'http://localhost:8080/music/scary3.mp3');

INSERT INTO MusicEmotion (emotion_id, music_id) values (5, 1);
INSERT INTO MusicEmotion (emotion_id, music_id) values (1, 2);
INSERT INTO MusicEmotion (emotion_id, music_id) values (1, 3);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 4);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 5);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 6);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 7);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 8);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 9);