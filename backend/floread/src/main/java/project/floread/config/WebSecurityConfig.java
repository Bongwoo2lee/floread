package project.floread.config;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import project.floread.security.JwtAuthenticationFilter;
import project.floread.security.OAuthUserServiceImpl;

@Configuration
@EnableWebSecurity
@Slf4j
@AllArgsConstructor
public class WebSecurityConfig {

    //jwt 필터를 사용할 예정
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final OAuthUserServiceImpl oAuthUserServiceImpl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //http 시큐리티 빌더
        http.cors()
                .and()
                .csrf().disable() //
                .httpBasic().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/", "/auth/**", "/oauth2/**", "/book").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .userInfoEndpoint()
                .userService(oAuthUserServiceImpl);


        return http.build();
    }


    // Add JwtAuthenticationFilter or any other custom filter beans if needed
}