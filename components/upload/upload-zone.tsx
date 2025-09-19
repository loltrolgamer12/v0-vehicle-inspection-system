"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, X } from "lucide-react"

interface UploadFile {
  file: File
  id: string
  status: "pending" | "uploading" | "processing" | "success" | "error"
  progress: number
  duplicates?: number
  newRecords?: number
  error?: string
}

export function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending" as const,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
  })

  const uploadFile = async (fileData: UploadFile) => {
    setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, status: "uploading", progress: 0 } : f)))

    const formData = new FormData()
    formData.append("file", fileData.file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileData.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 }
            }
            return f
          }),
        )
      }, 200)

      const response = await fetch("/api/upload/excel", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Error en la carga del archivo")
      }

      const result = await response.json()

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? {
                ...f,
                status: "success",
                progress: 100,
                duplicates: result.duplicates,
                newRecords: result.newRecords,
              }
            : f,
        ),
      )
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? {
                ...f,
                status: "error",
                progress: 0,
                error: error instanceof Error ? error.message : "Error desconocido",
              }
            : f,
        ),
      )
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "uploading":
      case "processing":
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (file: UploadFile) => {
    switch (file.status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "uploading":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Cargando</Badge>
      case "processing":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Procesando</Badge>
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cargar Archivos Excel</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Suelta los archivos aquí...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Arrastra archivos Excel aquí o haz clic para seleccionar</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Formatos soportados: .xlsx, .xls (máximo 10MB por archivo)
                </p>
                <Button variant="outline">Seleccionar Archivos</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Archivos en Cola</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((fileData) => (
                <div key={fileData.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getStatusIcon(fileData.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">{fileData.file.name}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(fileData)}
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(fileData.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      {fileData.status === "success" && (
                        <span>
                          {fileData.newRecords} nuevos • {fileData.duplicates} duplicados
                        </span>
                      )}
                    </div>

                    {(fileData.status === "uploading" || fileData.status === "processing") && (
                      <Progress value={fileData.progress} className="h-2" />
                    )}

                    {fileData.status === "error" && <p className="text-xs text-red-600 mt-1">{fileData.error}</p>}

                    {fileData.status === "pending" && (
                      <Button size="sm" onClick={() => uploadFile(fileData)} className="mt-2">
                        Cargar Archivo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
