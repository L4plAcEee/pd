package com.l4p.pd.service;


import com.l4p.pd.entity.User;
import com.l4p.pd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * 用户注册
     */
    public User register(User user) {
        // 检查手机号是否已注册
        if(userRepository.findByPhoneNumber(user.getPhoneNumber()) != null) {
            throw new RuntimeException("手机号已注册");
        }
        String hashedPassword = bCryptPasswordEncoder.encode(user.getPassword());  // 加盐哈希

        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    /**
     * 用户登录验证
     */
    public User login(String phoneNumber, String password) {
        User user = userRepository.findByPhoneNumber(phoneNumber);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        String hashedPassword = bCryptPasswordEncoder.encode(user.getPassword());

        if (!user.getPassword().equals(hashedPassword)) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }
}
