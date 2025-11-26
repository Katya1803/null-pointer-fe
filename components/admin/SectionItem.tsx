"use client";

import { useState, useEffect } from "react";
import { lectureService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { SectionResponse, LectureResponse } from "@/lib/types/course.types";
import { CreateLectureModal } from "./CreateLectureModal";
import { EditLectureModal } from "./EditLectureModal";

interface SectionItemProps {
  section: SectionResponse;
  sectionNumber: number;
  onUpdate: () => void;
  onDelete: () => void;
}

export function SectionItem({ section, sectionNumber, onUpdate, onDelete }: SectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lectures, setLectures] = useState<LectureResponse[]>([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureResponse | null>(null);

  useEffect(() => {
    if (isExpanded && lectures.length === 0) {
      fetchLectures();
    }
  }, [isExpanded]);

  const fetchLectures = async () => {
    try {
      setLoadingLectures(true);
      const { data } = await lectureService.getLecturesBySectionId(section.id);
      setLectures(data.data);
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
    } finally {
      setLoadingLectures(false);
    }
  };

  const handleLectureCreated = () => {
    setShowCreateModal(false);
    fetchLectures();
    onUpdate();
  };

  const handleLectureUpdated = () => {
    setEditingLecture(null);
    fetchLectures();
    onUpdate();
  };

  const handleDeleteLecture = async (lectureId: string, lectureTitle: string) => {
    if (!confirm(`Delete lecture "${lectureTitle}"?`)) {
      return;
    }

    try {
      await lectureService.deleteLecture(lectureId);
      fetchLectures();
      onUpdate();
    } catch (error) {
      alert("Failed to delete lecture: " + getErrorMessage(error));
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-dark-muted hover:text-dark-text transition-colors"
            >
              {isExpanded ? "▼" : "▶"}
            </button>
            <div className="flex-1">
              <h4 className="text-dark-text font-medium">
                Section {sectionNumber}: {section.title}
              </h4>
              <p className="text-sm text-dark-muted">
                {section.totalLectures} lectures • Order: {section.sortOrder}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm transition-colors"
            >
              Add Lecture
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pl-8 space-y-2">
            {loadingLectures ? (
              <p className="text-dark-muted text-sm">Loading lectures...</p>
            ) : lectures.length === 0 ? (
              <p className="text-dark-muted text-sm">No lectures yet</p>
            ) : (
              lectures.map((lecture, index) => (
                <div
                  key={lecture.id}
                  className="flex items-center justify-between p-3 bg-dark-bg border border-dark-border rounded"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-dark-muted text-sm">{index + 1}.</span>
                      <div>
                        <p className="text-dark-text">{lecture.title}</p>
                        <div className="flex items-center gap-3 text-xs text-dark-muted mt-1">
                          <span className="px-2 py-0.5 bg-dark-card rounded">
                            {lecture.type}
                          </span>
                          {lecture.duration && <span>{Math.floor(lecture.duration / 60)}m</span>}
                          {lecture.isPreview && (
                            <span className="text-primary-500">Preview</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLecture(lecture)}
                      className="px-3 py-1 bg-dark-card hover:bg-dark-border text-dark-text rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLecture(lecture.id, lecture.title)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateLectureModal
          sectionId={section.id}
          nextSortOrder={lectures.length}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleLectureCreated}
        />
      )}

      {editingLecture && (
        <EditLectureModal
          lecture={editingLecture}
          onClose={() => setEditingLecture(null)}
          onSuccess={handleLectureUpdated}
        />
      )}
    </div>
  );
}