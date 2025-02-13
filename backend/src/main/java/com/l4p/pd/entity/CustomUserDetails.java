package com.l4p.pd.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

/**
* 记录类的特点
 * 不可变性：
 * 记录类的实例是不可变的（immutable），即一旦创建，其状态（字段值）不能被修改。
 * 所有字段都是 final 的。
 * 简洁的语法：
 * 记录类通过简洁的语法定义，避免了传统 Java 类中大量的样板代码（如构造函数、equals()、hashCode()、toString() 等）。
 * 自动生成的方法：
 * 编译器会自动为记录类生成以下方法：
 * 构造函数（用于初始化所有字段）
 * equals() 方法
 * hashCode() 方法
 * toString() 方法
 * 这些方法基于记录类的字段。
 * 字段是私有的且不可修改：
 * 记录类的字段是私有的（private final），并且只能通过访问器方法（getter）访问。
 * 不能显式继承其他类：
 * 记录类隐式继承自 java.lang.Record，因此不能显式继承其他类。
 * 但可以实现接口。
* */
public record CustomUserDetails(User user) implements UserDetails {

    // 如果使用手机号作为登录标识，可以返回 phoneNumber
    @Override
    public String getUsername() {
        return user.getPhoneNumber();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // 根据 user 的 role 字段构造权限对象
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 假设 role 存储的是类似 "USER", "ADMIN" 的值
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 或者根据业务逻辑进行判断
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 或者根据业务逻辑进行判断
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 或者根据业务逻辑进行判断
    }

    @Override
    public boolean isEnabled() {
        return true; // 或者根据业务逻辑进行判断
    }
}

