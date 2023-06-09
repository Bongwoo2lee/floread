package project.floread.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import project.floread.model.Book;
import project.floread.model.Emotion;
import project.floread.model.Music;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class MusicEmotionRepository {

    private final EntityManager em;

    public List<Music> findByMusic(Emotion emotion) {
        return em.createQuery("select me.music from MusicEmotion me where me.emotion = :emotion", Music.class)
                .setParameter("emotion", emotion)
                .getResultList();
    }

    public long findByEmotion(Emotion emotion) {
        return em.createQuery("select e.id from Emotion e where e.emotion = :emotion", Long.class)
                .setParameter("emotion", emotion)
                .getSingleResult();
    }

    public String findByUrl(long MusicId) {
        return em.createQuery("select m.url from Music m where m.id = :MusicId", String.class)
                .setParameter("MusicId", MusicId)
                .getSingleResult();
    }
}

