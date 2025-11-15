package com.agn.web.controller;


import com.agn.web.entity.StudentDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String helloWorld() {
        return "Hello, student!";
    }
}
