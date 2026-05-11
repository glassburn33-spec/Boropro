import { SearchResult } from "@/lib/searchIndex";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
}

export function SearchResults({
  results,
  query,
  onClose,
  onSelectResult,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <Card className="bg-stone-800 border-stone-700 p-6 w-full max-w-2xl mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Search Results</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-stone-400">
            No results found for "{query}". Try searching for equipment names,
            colors, manufacturers, or specifications.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
      <Card className="bg-stone-800 border-stone-700 p-6 w-full max-w-2xl mx-4 my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            Search Results ({results.length})
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => {
                onSelectResult(result);
                onClose();
              }}
              className="bg-stone-700 hover:bg-stone-600 p-3 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-amber-300 text-sm">
                    {result.title}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {result.subtitle && <span>{result.subtitle} • </span>}
                    <span className="bg-amber-700/30 px-2 py-0.5 rounded text-amber-300">
                      {result.category}
                    </span>
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-stone-900 px-2 py-1 rounded">
                  {result.type}
                </span>
              </div>
              {result.description && (
                <p className="text-xs text-stone-300 line-clamp-2">
                  {result.description}
                </p>
              )}
              {result.matchedFields.length > 0 && (
                <div className="text-xs text-stone-400 mt-2">
                  Matched in: {result.matchedFields.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-700">
          <p className="text-xs text-stone-400">
            Tip: Press <kbd className="bg-stone-900 px-1 rounded">Esc</kbd> to
            close
          </p>
        </div>
      </Card>
    </div>
  );
}
