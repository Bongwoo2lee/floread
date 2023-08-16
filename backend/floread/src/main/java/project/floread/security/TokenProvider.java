package project.floread.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;



@Slf4j
@Service
public class TokenProvider {

    private final byte[] key;

    public TokenProvider(@Value("${jwt.secret}") String secretKey) {
        log.info("key[{}]", secretKey);
        this.key = secretKey.getBytes();
    }

    public String create(Authentication authentication) {
        //만료 날짜 1일로 설정
        Date expiryDate = Date.from(
                Instant.now()
                        .plus(1, ChronoUnit.DAYS)
        );


        return Jwts.builder()
                //헤더의 시크릿 키와 서명
                //.signWith(SignatureAlgorithm.HS512, key.getBytes())
                //payload에 들어갈 내용
                .setSubject(authentication.getName()) //sub
                .setIssuedAt(new Date()) //만든 날짜
                .setExpiration(expiryDate)//만료 날짜
                .signWith(SignatureAlgorithm.HS512, key)
                .compact();
    }

    public String validateAndGetUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}
