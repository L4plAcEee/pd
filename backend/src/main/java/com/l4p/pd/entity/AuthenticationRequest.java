package com.l4p.pd.entity;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthenticationRequest {

    // getter 和 setter 方法
    private String username;
    private String password;

    // 默认构造函数
    public AuthenticationRequest() {
    }

    // 带参构造函数
    public AuthenticationRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

}
