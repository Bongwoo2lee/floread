package project.floread;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class FloreadApplication {

	public static void main(String[] args) {
		deleteFile("image");
		deleteFile("book");
		SpringApplication.run(FloreadApplication.class, args);
	}

	public static void deleteFile(String name) {
		String directoryPath = "/home/floread/" + name + "/"; // 디렉토리 경로 설정

		// 디렉토리 내의 파일 목록 가져오기
		File directory = new File(directoryPath);
		File[] files = directory.listFiles();

		if (files != null) {
			if (files.length > 0) { // 파일이 하나 이상 존재할 때만 처리
				for (File file : files) {
					// 파일 삭제 로직
					if (file.delete()) {
						System.out.println("파일 삭제 성공: " + file.getName());
					} else {
						System.out.println("파일 삭제 실패: " + file.getName());
					}
					file = null;
				}
			} else {
				System.out.println("디렉토리가 비어 있음: " + directoryPath);
			}
			directory = null;
		}
		directory = null;
	}
}
