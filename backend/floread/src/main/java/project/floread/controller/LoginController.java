package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.floread.model.RequestUser;
import project.floread.model.User;
import project.floread.service.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/login")
public class LoginController {
    private final UserService userService;

    @CrossOrigin(origins = "http://localhost:8080/collback")
    @PostMapping("/naver")
    public ResponseEntity<RequestUser> getNaverData(@RequestBody RequestUser requestUser) {
        User user = User.builder()
                .userId(requestUser.getId())
                .name(requestUser.getName())
                .email(requestUser.getEmail())
                .build();
        userService.join(user);

        return ResponseEntity.ok(requestUser);
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/google")
    public ResponseEntity<RequestUser> getGoogleData(@RequestBody RequestUser requestUser) {

        try {
            User user = User.builder()
                    .userId(requestUser.getId())
                    .name(requestUser.getName())
                    .email(requestUser.getEmail())
                    .build();
            userService.join(user);
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(requestUser);
        }
        return ResponseEntity.ok(requestUser);
    }

}

