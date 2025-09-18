import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Search, Calendar, User } from 'lucide-react';

interface Resume {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  candidate?: string;
  skills?: string[];
  experience?: string;
}

export const ViewResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);

  useEffect(() => {
    // Load from localStorage and add some mock data for demo
    const storedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const mockResumes: Resume[] = [
      {
        id: '1',
        name: 'john_doe_resume.pdf',
        size: 245760,
        uploadDate: new Date('2024-01-15'),
        candidate: 'John Doe',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: '5 years'
      },
      {
        id: '2',
        name: 'sarah_smith_cv.pdf',
        size: 180240,
        uploadDate: new Date('2024-01-10'),
        candidate: 'Sarah Smith',
        skills: ['Python', 'Machine Learning', 'Django'],
        experience: '3 years'
      },
      {
        id: '3',
        name: 'mike_johnson_resume.pdf',
        size: 198540,
        uploadDate: new Date('2024-01-05'),
        candidate: 'Mike Johnson',
        skills: ['Java', 'Spring Boot', 'AWS'],
        experience: '7 years'
      }
    ];
    
    const allResumes = [...storedResumes, ...mockResumes];
    setResumes(allResumes);
    setFilteredResumes(allResumes);
  }, []);

  useEffect(() => {
    const filtered = resumes.filter(resume => 
      resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.candidate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredResumes(filtered);
  }, [searchTerm, resumes]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleView = (resume: Resume) => {
    // In a real app, this would open a PDF viewer
    alert(`Opening ${resume.name}...`);
  };

  const handleDownload = (resume: Resume) => {
    // In a real app, this would trigger a download
    alert(`Downloading ${resume.name}...`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resume Database</h1>
        <p className="text-muted-foreground">Browse and manage uploaded resumes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>All Resumes ({filteredResumes.length})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, candidate, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="relative group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-accent/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{resume.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(resume.size)}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {resume.candidate && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{resume.candidate}</span>
                      </div>
                      {resume.experience && (
                        <p className="text-xs text-muted-foreground">{resume.experience} experience</p>
                      )}
                    </div>
                  )}

                  {resume.skills && resume.skills.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {resume.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {resume.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resume.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(resume.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(resume)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(resume)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResumes.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No resumes found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload some resumes to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};