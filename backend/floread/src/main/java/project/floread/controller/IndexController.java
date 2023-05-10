package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import project.floread.config.auth.LoginUser;
import project.floread.config.auth.dto.SessionUser;

import javax.servlet.http.HttpSession;

@RequiredArgsConstructor
@Controller
public class IndexController {
    //@Value("${file.dir}")
    private String fileDir;
    //페이지에 관련된 컨트롤러는 모두 IndexController를 사용합니다.

    //머스테치의 파일 위치는 기본적으로 src/main/resources/templates입니다
    //이 위치에 머스테치 파일을 두면 스프링 부트에서 자동으로 로딩합니다.
    private final HttpSession httpSession;

    @GetMapping("/")
    public String index(Model model, @LoginUser SessionUser user) {
        //Model = 서버 템플릿 엔진에서 사용할 수 있는 객체를 저장.
        //어느 컨트롤러든지 @LoginUser만 사용하면 세션 정보를 가져올 수 있음.
        if (user != null) {
            model.addAttribute("googleName", user.getName());
        }
        return "index";
    }


}