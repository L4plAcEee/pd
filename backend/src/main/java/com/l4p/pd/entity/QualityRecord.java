package com.l4p.pd.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;


@Setter
@Getter
@Entity
@Table(name = "quality_record")
public class QualityRecord {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 通过 OneToOne 关联磨房数据
    @OneToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private MillData millData;

    @Column(name = "qualified_quantity")
    private Integer qualifiedQuantity;

    @Column(length = 50)
    private String status;

    @Column(length = 255)
    private String reason;

    // Getter 和 Setter 方法

}
