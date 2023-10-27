package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.floread.model.Music;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {

    @Query(value = "select m.url from Music m where m.id = :id")
    String findByMusicUrl(@Param("id") Long id);

    @Query(value = "select m.genre from Music m where m.genre = :genre")
    String findByGenre(@Param("genre") String genre);
}
