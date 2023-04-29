package project.floread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.floread.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}