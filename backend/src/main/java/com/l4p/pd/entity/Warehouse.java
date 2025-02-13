package com.l4p.pd.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.sql.Timestamp;

@Setter
@Getter
@Entity
@Table(name = "warehouse")
public class Warehouse {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 这里使用 productId 存储产品的标识，可与 supplier_data 或 mill_data 对应
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "inbound_time")
    private Timestamp inboundTime;

    @Column(nullable = false, length = 50)
    private String source;

    // Getter 和 Setter 方法

}
