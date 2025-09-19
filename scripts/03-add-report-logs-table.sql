-- Create report logs table for tracking generated reports
CREATE TABLE IF NOT EXISTS report_logs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    format VARCHAR(50) NOT NULL DEFAULT 'pdf',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    file_size VARCHAR(50),
    download_url TEXT,
    created_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create search logs table for tracking searches
CREATE TABLE IF NOT EXISTS search_logs (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    search_type VARCHAR(50) DEFAULT 'global',
    user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_report_logs_created_at ON report_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_report_logs_type ON report_logs(type);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);

-- Add trigger to update updated_at timestamp for report_logs
CREATE OR REPLACE FUNCTION update_report_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_report_logs_updated_at
    BEFORE UPDATE ON report_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_report_logs_updated_at();
