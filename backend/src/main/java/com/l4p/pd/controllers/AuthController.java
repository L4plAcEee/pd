package com.l4p.pd.controllers;


import com.l4p.pd.entity.AuthenticationRequest;
import com.l4p.pd.entity.User;
import com.l4p.pd.service.UserService;
import com.l4p.pd.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
/**
 * 认证相关接口：注册和登录
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

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

    @PostMapping
    public String createToken(@RequestBody AuthenticationRequest authenticationRequest) {
        // 使用AuthenticationManager进行身份验证
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));

        // 将认证的用户信息设置到Spring Security的上下文中
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 生成并返回JWT Token
        return jwtUtil.generateToken(authenticationRequest.getUsername());
    }
}
