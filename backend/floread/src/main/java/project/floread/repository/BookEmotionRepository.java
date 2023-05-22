package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.floread.model.BookEmotion;

public interface BookEmotionRepository extends JpaRepository<BookEmotion, Long> {
}
