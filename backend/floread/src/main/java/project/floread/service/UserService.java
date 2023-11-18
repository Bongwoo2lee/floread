package project.floread.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.floread.model.User;
import project.floread.repository.UserRepository;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    //유저 정보 생성
    public User create(final User user) {
        if(user == null || user.getName() == null) {
            throw new RuntimeException("Invalid arguments");
        }
        final String name = user.getName();
        if(userRepository.existsByName(name)) {
            log.warn("Username already exists {}", name);
            throw new RuntimeException("Username already exists");
        }

        return userRepository.save(user);
    }

}
