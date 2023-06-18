package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.floread.model.BookEntity;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, String> {
    //jpaRepository<T, id> t는 테이블에 매핑할 엔티티 클래스, id는 엔티티의 기본키 타입

    List<BookEntity> findByUserId(String userId);
}
