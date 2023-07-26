package project.floread.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import project.floread.model.UserEntity;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;



@Slf4j
@Service
public class TokenProvider {

    //@Autowired
    //@Value("${jwt.secret}")
    //private final Key key;
    private static final String key = "MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAaSQx/hj28ypAIQPwyHRAtbIG6oC6WBwE\n" +
            "1AyGf1q1Q89A5XHn3Z6gTHE+8iLZhAlNaR7xTr2oVCrGnQY4THdWBwIDAQAB";


    public String create(UserEntity userEntity) {
        //만료 날짜 1일로 설정
        Date expiryDate = Date.from(
                Instant.now()
                        .plus(1, ChronoUnit.DAYS)
        );


        return Jwts.builder()
                //헤더의 시크릿 키와 서명
                .signWith(SignatureAlgorithm.HS512, key.getBytes())
                //payload에 들어갈 내용
                .setSubject(userEntity.getId()) //sub
                .setIssuer("floread") //앱 이름
                .setIssuedAt(new Date()) //만든 날짜
                .setExpiration(expiryDate)//만료 날짜
                .compact();
    }

    public String validateAndGetUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key.getBytes())
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}
