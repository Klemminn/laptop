update laptops as x 
set (cpu_vendor, cpu_type, cpu_model, ram, hdd_type, hdd_capacity, display_size, display_resolution, brand, gpu_vendor, gpu_model) = 
(y.cpu_vendor, y.cpu_type, y.cpu_model, y.ram, y.hdd_type, y.hdd_capacity, y.display_size, y.display_resolution, y.brand, y.gpu_vendor, y.gpu_model) from laptops as y 
where x.cpu_vendor is null 
and y.cpu_vendor is not null
and x.product_id is not null and x.product_id not like ''
and y.product_id = x.product_id