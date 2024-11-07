import ConfigurationForm from "@/components/ConfigurationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50/90">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mikrotik Load Balancer Configuration</h1>
            <p className="text-sm text-muted-foreground">
              Tạo cấu hình cân bằng tải cho RouterOS
            </p>
          </div>
        </div>
        <ConfigurationForm />
      </div>
    </div>
  );
};

export default Index;