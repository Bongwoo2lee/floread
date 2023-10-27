package project.floread.config;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationCodeGrantFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.web.filter.CorsFilter;
import project.floread.config.auth.CustomOAuth2UserService;
import project.floread.security.JwtAuthenticationFilter;
import project.floread.security.OAuthSuccessHandler;
import project.floread.security.RedirectUrlCookieFilter;

@Configuration
@EnableWebSecurity
@Slf4j
@AllArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    //jwt 필터를 사용할 예정
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomOAuth2UserService customOAuth2UserService;

    private final OAuthSuccessHandler oAuthSuccessHandler;

    private final RedirectUrlCookieFilter redirectUrlCookieFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //http 시큐리티 빌더
        http.cors()
                .and()
                .csrf().disable() //
                .httpBasic().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/", "/auth/**", "/oauth2/**", "/book/**", "/test/**", "/music/**", "/video/**", "/upload/**", "/viewer/**", "/mypage/**", "/download/**", "/update/**", "/image/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                //1. 코드 받고 2 엑세스 토큰 3프로필 가져오고 4회원가입
                .userInfoEndpoint()
                .userService(customOAuth2UserService)
                .and()
                .successHandler(oAuthSuccessHandler)
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new Http403ForbiddenEntryPoint());

        http.addFilterBefore(
                redirectUrlCookieFilter,
                OAuth2AuthorizationCodeGrantFilter.class
        );

        http.addFilterAfter(
                jwtAuthenticationFilter,
                CorsFilter.class
        );


    }

    // Add JwtAuthenticationFilter or any other custom filter beans if needed
}