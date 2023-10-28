package project.floread.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@Setter @Getter
public class AuthenticationService {
    Authentication authentication;

}
