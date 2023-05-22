package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.floread.model.Emotion;

import java.util.List;

@Repository
public interface EmotionRepository extends JpaRepository<Emotion, Long> {

    //감정을 입력하면 그거에 맞는 음악의 경로를 선택
    @Query("SELECT m.url from Music m JOIN  m.musicEmotions me JOIN  me.emotion e WHERE e.emotion = :emotion")
    List<String> findUrlByEmotion(@Param("emotion") String emotion);
}
