package com.l4p.pd.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
@Table(name = "mill_data")
public class MillData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName = "磨房";

    @Column(name = "quality_status", length = 50)
    private String qualityStatus = "待检";

    // Getter 和 Setter 方法

}
