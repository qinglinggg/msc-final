package com.mscteam.mscbackend.Filedb;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController("/api/v1")
@CrossOrigin("*")
public class FileController {
    
    @Autowired
    private FileService storageService;

    @PostMapping("/upload")
    public FileDB uploadFile(@RequestParam("file") MultipartFile file) {
        FileDB result = null;
        String message = "";
        try {
            result = storageService.store(file);
            message = "Uploaded file successfully. ->" + file.getOriginalFilename();
            System.out.print(message);
        } catch (Exception e) {
            message = "Upload failed. -> " + file.getOriginalFilename();
            System.out.println(message);
        }
        return result;
    }

    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        List<ResponseFile> files = storageService.getAllFiles().map(file -> {
            String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/files/")
                            .path(file.getId())
                            .toUriString();
            return new ResponseFile(file.getName(), fileUri, file.getType(), file.getData().length);
        }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        FileDB fileDB = storageService.getFile(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
                .body(fileDB.getData());
    }
}
