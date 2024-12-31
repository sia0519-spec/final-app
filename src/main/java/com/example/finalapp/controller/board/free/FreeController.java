package com.example.finalapp.controller.board.free;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/board/free")
@RequiredArgsConstructor
public class FreeController {
    @GetMapping("/list")
    public String list() {
        return "board/free/list";
    }
    @GetMapping("/write")
    public String write() {
        return "board/free/write";
    }
    @GetMapping("/detail")
    public String detail() {
        return "board/free/detail";
    }
    @GetMapping("/modify")
    public String modify() {
        return "board/free/modify";
    }
}
