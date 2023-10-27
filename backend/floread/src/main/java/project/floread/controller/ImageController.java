package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.floread.service.BookService;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
public class ImageController {

    private final BookService bookService;

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("bookId") Long bookId) {
        try {
            String currentUrl = System.getProperty("user.dir");
            File currentFolder = new File(currentUrl);
            File parentFolder = currentFolder.getParentFile();
            String imageUrl = parentFolder.getAbsolutePath()+"/image/";
            File destinationImage = new File(imageUrl + file.getName()+".png");

            //부모디렉토리가 존재하지 않으면 생성
            destinationImage.getParentFile().mkdirs();

            //파일 경로 출력
            System.out.println("destinationImage = " + destinationImage);
            //파일 이동
            file.transferTo(destinationImage);

            bookService.insertImageUrl(file.getName(), bookId);


            return new ResponseEntity<>("이미지 업로드 및 처리 성공", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("이미지 업로드 및 처리 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://floread.store:3000")
    @GetMapping("/image/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        // 이미지 파일의 경로 설정
        String filePath = "/home/floread/image/"+filename+".png";
        //String filePath = "/Users/seokbeomlee/Desktop/Project/refactor/floread/backend/image/"+filename+".png";
        System.out.println("filePath = " + filePath);
        Path path = Paths.get(filePath);

        // PathResource를 사용하여 Resource 객체 생성
        Resource resource = new PathResource(path);


        if (resource.exists() && resource.isReadable()) {
            String contentType = "image/png"; // MP3 파일의 MIME 타입

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .body(resource);
        } else {
            // 파일을 찾을 수 없거나 읽을 수 없는 경우 404 에러 반환
            return ResponseEntity.notFound().build();
        }
    }
}
