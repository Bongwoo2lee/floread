package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.floread.model.Emotion;

import java.util.List;

public interface EmotionRepository extends JpaRepository<Emotion, Long> {

//    @Query(value = "select e.url from Emotion e where e.")
//    List<String> findUrlByEmotion(String emotion);

    @Query(value = "select e from Emotion e where e.emotion = :emotion")
    Emotion findByEmotion(@Param("emotion") String emotion);
}
