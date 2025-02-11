package com.l4p.pd.controller;


import com.l4p.pd.entity.User;
import com.l4p.pd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 认证相关接口：注册和登录
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // 用户注册
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // 用户登录
    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        // 仅接收手机号和密码
        return userService.login(loginRequest.getPhoneNumber(), loginRequest.getPassword());
    }
}
