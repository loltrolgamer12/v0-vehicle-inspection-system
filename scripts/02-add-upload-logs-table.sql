-- Create upload logs table for tracking Excel uploads
CREATE TABLE IF NOT EXISTS upload_logs (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_records INTEGER DEFAULT 0,
    new_records INTEGER DEFAULT 0,
    duplicates INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    uploaded_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_upload_logs_created_at ON upload_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_upload_logs_status ON upload_logs(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_upload_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_upload_logs_updated_at
    BEFORE UPDATE ON upload_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_upload_logs_updated_at();
