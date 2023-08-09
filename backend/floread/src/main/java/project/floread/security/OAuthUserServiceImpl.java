package project.floread.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import project.floread.model.UserEntity;
import project.floread.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthUserServiceImpl implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        //기존 loaduser 호출
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        //System.out.println("delegate = " + delegate);
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        System.out.println("oAuth2User = " + oAuth2User.getAttribute("sub"));
        //System.out.println("oAuth2User = " + oAuth2User);
//        try {
//            log.info("OAuth2User attributes {}", new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }



        final String username = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        final String authProvider = userRequest.getClientRegistration().getRegistrationId();

        UserEntity userEntity = null;

        if(!userRepository.existsByUsername(username)) {
            userEntity = UserEntity.builder()
                    .username(username)
                    .authProvider(authProvider)
                    .build();
            userEntity = userRepository.save(userEntity);
        }

        log.info("Successfully pulled user info username {} authProvider {}", username, authProvider);

        return oAuth2User;
    }
}
