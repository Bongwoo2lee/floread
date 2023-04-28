package project.floread.model;

import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Map;

public interface ProviderUser {

    //공통된 정보들
    String getId();
    String getUsername();
    String getPassword();
    String getEmail();
    //구글, 네이버, 카카오
    String getProvider();

    //권한
    List<? extends GrantedAuthority> getAuthorities();

    //사용자 속성
    Map<String, Object> getAttributes();
}
