"use client";

import { useState } from "react";
import { sectionService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { SectionResponse } from "@/lib/types/course.types";
import { CreateSectionModal } from "./CreateSectionModal";
import { SectionItem } from "./SectionItem";

interface CourseSectionsListProps {
  courseId: string;
  sections: SectionResponse[];
  onUpdate: () => void;
}

export function CourseSectionsList({ courseId, sections, onUpdate }: CourseSectionsListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSectionCreated = () => {
    setShowCreateModal(false);
    onUpdate();
  };

  const handleDeleteSection = async (sectionId: string, sectionTitle: string) => {
    if (!confirm(`Delete section "${sectionTitle}"? This will also delete all lectures in this section.`)) {
      return;
    }

    try {
      await sectionService.deleteSection(sectionId);
      onUpdate();
    } catch (error) {
      alert("Failed to delete section: " + getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-dark-text">
          Course Content ({sections.length} sections)
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
        >
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-dark-border rounded-lg">
          <p className="text-dark-muted mb-4">No sections yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
          >
            Create First Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              sectionNumber={index + 1}
              onUpdate={onUpdate}
              onDelete={() => handleDeleteSection(section.id, section.title)}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateSectionModal
          courseId={courseId}
          nextSortOrder={sections.length}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSectionCreated}
        />
      )}
    </div>
  );
}