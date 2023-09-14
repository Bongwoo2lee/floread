
INSERT INTO Emotion (emotion) values ('happy');
INSERT INTO Emotion (emotion) values ('anxious');
INSERT INTO Emotion (emotion) values ('surprise');
INSERT INTO Emotion (emotion) values ('sad');
INSERT INTO Emotion (emotion) values ('angry');
INSERT INTO Emotion (emotion) values ('neutrality');

INSERT INTO Music (title, url) values  ('angry.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/angry.mp3');
INSERT INTO Music (title, url) values  ('happy1.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/happy1.mp3');
INSERT INTO Music (title, url) values  ('happy2.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/happy2.mp3');
INSERT INTO Music (title, url) values  ('sad1.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/sad1.mp3');
INSERT INTO Music (title, url) values  ('sad2.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/sad2.mp3');
INSERT INTO Music (title, url) values  ('sad3.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/sad3.mp3');
INSERT INTO Music (title, url) values  ('scary1.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/scary1.mp3');
INSERT INTO Music (title, url) values  ('scary2.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/scary2.mp3');
INSERT INTO Music (title, url) values  ('scary3.mp3', '/Users/seokbeomlee/Desktop/Project/floread/svelte-start-app/public/music/scary3.mp3');

INSERT INTO MusicEmotion (emotion_id, music_id) values (5, 1);
INSERT INTO MusicEmotion (emotion_id, music_id) values (1, 2);
INSERT INTO MusicEmotion (emotion_id, music_id) values (1, 3);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 4);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 5);
INSERT INTO MusicEmotion (emotion_id, music_id) values (4, 6);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 7);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 8);
INSERT INTO MusicEmotion (emotion_id, music_id) values (2, 9);