package project.floread.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.floread.model.Book;
import project.floread.model.User;
import project.floread.repository.UserRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public Long join(User user) {
        validateDuplicateUser(user.getUserId());
        userRepository.save(user);
        return user.getId();
    }

    //존재하는 책인지 확인하는 함수
    private void validateDuplicateUser(String id) {
        User findUser = userRepository.findByUserId(id);
        if(findUser != null) {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }
    }

}
