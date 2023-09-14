package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.floread.model.Emotion;
import project.floread.model.Music;
import project.floread.model.MusicEmotion;

import java.util.List;

public interface MusicEmotionRepository extends JpaRepository<MusicEmotion, Long> {
    @Query(value = "select me.music from MusicEmotion me where me.emotion = :emotion")
    List<Music> findByMusic(@Param("emotion") Emotion emotion);


    @Query(value = "select me.music.url from MusicEmotion me where me.emotion.id = :id")
    List<String> findByMusicUrlFromEmotionId(@Param("id") Long id);
}
