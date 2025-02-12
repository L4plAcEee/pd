package com.l4p.pd.filter;

import com.l4p.pd.entity.CustomUserDetails;
import com.l4p.pd.service.UserService;
import com.l4p.pd.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain; // 使用 jakarta 包
import jakarta.servlet.ServletException; // 使用 jakarta 包
import jakarta.servlet.http.HttpServletRequest; // 使用 jakarta 包
import jakarta.servlet.http.HttpServletResponse; // 使用 jakarta 包
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {

        // 获取请求头中的 Authorization 字段
        final String token = request.getHeader("Authorization");
        String username = null;

        // 如果请求头中有 Bearer token
        if (token != null && token.startsWith("Bearer ")) {
            username = jwtUtil.extractUsername(token.substring(7));  // 提取 token 中的用户名部分
        }

        // 如果 token 和用户名都有效且当前没有认证信息
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 通过用户服务加载用户详情
            CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByUsername(username);

            // 校验 token 是否有效
            if (jwtUtil.validateToken(token, username)) {
                // 如果 token 验证通过，创建认证对象
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                // 设置 Web 请求详情，通常是用于跟踪请求来源
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 将认证信息存储到 Spring Security 的上下文中
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        // 将请求传递给过滤器链中的下一个过滤器
        chain.doFilter(request, response);
    }
}
