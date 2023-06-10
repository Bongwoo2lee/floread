package project.floread.config.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import project.floread.model.Role;

import java.util.Arrays;

@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomOAuth2UserService customOAuth2UserService;

    //role에 따라 허용되는 url
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().headers().frameOptions().disable().and()
                .authorizeRequests()
                .antMatchers("/", "/css/**", "/images/**", "/js/**", "/h2-console/**", "/upload", "/mypage", "/delete","/book/**" , "/music/**").permitAll()
                .antMatchers("api/v1/**").hasRole(Role.USER.name())
                .anyRequest().authenticated()
                .and().logout().logoutSuccessUrl("/")
                .and().oauth2Login().userInfoEndpoint().userService(customOAuth2UserService);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080","http://floread.store:8000", "http://floread.store:8080")); // 허용할 오리진 설정
        //configuration.setAllowedOrigins(Arrays.asList("http://floread.store:8000")); // 허용할 오리진 설정
        //configuration.setAllowedOrigins(Arrays.asList("http://floread.store:8080")); // 허용할 오리진 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // 허용할 메서드 설정
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization")); // 허용할 헤더 설정
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
