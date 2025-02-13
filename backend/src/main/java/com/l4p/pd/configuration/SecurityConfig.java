package com.l4p.pd.configuration;

import com.l4p.pd.filter.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig{

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)  // 关闭 CSRF 保护（仅在 REST API 时）
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/public/**").permitAll()  // 允许公共路径访问
                        .anyRequest().authenticated()  // 其他请求需要认证
                )
                .formLogin(form -> form    // ✅ 新的 `formLogin` 配置方式
                        .loginPage("/login")   // 自定义登录页面
                        .defaultSuccessUrl("/home", true)  // 登录成功后跳转页面
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")  // 退出登录 URL
                        .logoutSuccessUrl("/login?logout")  // 退出成功后跳转
                        .permitAll()
                );

        return http.build();
    } // ✅ 这样写符合 Spring Security 6.1+ 的新规范！

    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // 这里可以自定义UserDetailsService实现来加载用户数据
        return username -> User.withUsername(username)
                .password(passwordEncoder().encode("password"))
                .roles("USER")
                .build();
    }

    // ✅ 手动创建 AuthenticationManager（替代 super.authenticationManagerBean()）
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
