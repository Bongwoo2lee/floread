package project.floread.controller;

import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.floread.model.Book;
import project.floread.service.BookService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
public class ImageController {

    private final BookService bookService;

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("file = " + file.getOriginalFilename());
        System.out.println("file.getName() = " + file.getName());
        System.out.println("file.toString() = " + file);
        System.out.println("file.getSize() = " + file.getSize());
        System.out.println("file.getResource() = " + file.getResource());
        String sourceFileName = file.getOriginalFilename();
        //원본파일확장자명
        String sourceFileNameExtension = FilenameUtils.getExtension(sourceFileName);
        //확장자빼고
        String title = FilenameUtils.removeExtension(sourceFileName);

        //저장될 파일
        File destinationBook;
        String destinationImageName;
        String currentUrl = System.getProperty("user.dir");
        File currentFolder = new File(currentUrl);
        File parentFolder = currentFolder.getParentFile();
        String imageUrl = parentFolder.getAbsolutePath()+"/image/";
        System.out.println(imageUrl);
        try {
            assert title != null;

            destinationImageName = title + ".png";

            //파일 경로
            destinationBook = new File(imageUrl + destinationImageName);

            //부모디렉토리가 존재하지 않으면 생성
            destinationBook.getParentFile().mkdirs();
            //파일 이동
            file.transferTo(destinationBook);

            return new ResponseEntity<>("이미지 업로드 및 처리 성공", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("이미지 업로드 및 처리 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://floread.store:3000")
    @GetMapping("/image/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        // 이미지 파일의 경로 설정
        String filePath = "/home/floread/image/"+filename+".png";
        //String filePath = "/Users/seokbeomlee/Desktop/Project/refactor/floread/backend/image/"+filename+".png";
        System.out.println("filePath = " + filePath);
        Path path = Paths.get(filePath);

        // PathResource를 사용하여 Resource 객체 생성
        Resource resource = new PathResource(path);
        System.out.println("resource = " + resource);


        if (resource.exists() && resource.isReadable()) {
            String contentType = "image/png"; // image

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
