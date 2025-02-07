package com.l4p.pd.repository;


import com.l4p.pd.entity.MillData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MillDataRepository extends JpaRepository<MillData, Long> {
    // 根据品控状态查询待检产品
    List<MillData> findByQualityStatus(String qualityStatus);
}
